import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Daum } from '../../../core/models/diplomas.interface';
import { Exam } from '../../../core/models/exams.interface';
import { DiplomasService } from '../../../core/services/diplomas/diplomas.service';
import { ExamsService } from '../../../core/services/exams/exams.service';

@Component({ selector: 'app-exams-management', imports: [ReactiveFormsModule], templateUrl: './exams-management.component.html', styleUrl: './exams-management.component.css' })
export class ExamsManagementComponent implements OnInit {
  private readonly examsService = inject(ExamsService);
  private readonly diplomasService = inject(DiplomasService);
  private readonly fb = inject(FormBuilder);
  exams: Exam[] = [];
  diplomas: Daum[] = [];
  editingId: string | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  readonly form = this.fb.nonNullable.group({ diplomaId: ['', Validators.required], title: ['', Validators.required], description: [''], image: [''], duration: [30, [Validators.required, Validators.min(1)]] });

  ngOnInit(): void {
    this.diplomasService.getAllDiplomas().subscribe({
      next: ({ payload }) => {
        this.diplomas = payload?.data ?? [];
        if (this.diplomas.length) { this.form.controls.diplomaId.setValue(this.diplomas[0].id); this.loadExams(); }
        else this.isLoading = false;
      },
      error: () => { this.errorMessage = 'Unable to load diplomas.'; this.isLoading = false; },
    });
  }

  loadExams(): void {
    const diplomaId = this.form.controls.diplomaId.value;
    if (!diplomaId) return;
    this.isLoading = true;
    this.examsService.getDiplomaExams(diplomaId).subscribe({
      next: ({ payload }) => { this.exams = payload?.data ?? []; this.isLoading = false; },
      error: () => { this.errorMessage = 'Unable to load exams.'; this.isLoading = false; },
    });
  }

  editExam(exam: Exam): void {
    this.editingId = exam.id;
    this.form.patchValue({ diplomaId: exam.diploma?.id, title: exam.title, description: exam.description ?? '', image: exam.image ?? '', duration: exam.duration });
  }

  resetForm(): void {
    const diplomaId = this.form.controls.diplomaId.value;
    this.editingId = null;
    this.form.reset({ diplomaId, title: '', description: '', image: '', duration: 30 });
  }

  saveExam(): void {
    if (this.form.invalid || this.isSaving) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const payload = this.form.getRawValue();
    const request = this.editingId ? this.examsService.updateExam(this.editingId, payload) : this.examsService.createExam(payload);
    request.subscribe({ next: () => { this.isSaving = false; this.resetForm(); this.loadExams(); }, error: () => { this.errorMessage = 'Unable to save the exam.'; this.isSaving = false; } });
  }

  deleteExam(exam: Exam): void {
    if (!window.confirm(`Delete ${exam.title}?`)) return;
    this.examsService.deleteExam(exam.id).subscribe({ next: () => { this.exams = this.exams.filter(({ id }) => id !== exam.id); }, error: () => { this.errorMessage = 'Unable to delete the exam.'; } });
  }
}
