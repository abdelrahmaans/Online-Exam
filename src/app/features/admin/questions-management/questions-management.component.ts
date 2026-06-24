import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Daum } from '../../../core/models/diplomas.interface';
import { Exam } from '../../../core/models/exams.interface';
import { Question } from '../../../core/models/question.interface';
import { AdminService } from '../../../core/services/admin/admin.service';
import { DiplomasService } from '../../../core/services/diplomas/diplomas.service';
import { ExamsService } from '../../../core/services/exams/exams.service';
import { QuestionsService, QuestionPayload } from '../../../core/services/questions/questions.service';

@Component({
  selector: 'app-questions-management',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './questions-management.component.html',
  styleUrl: './questions-management.component.css',
})
export class QuestionsManagementComponent implements OnInit {
  private readonly diplomasService = inject(DiplomasService);
  private readonly examsService = inject(ExamsService);
  private readonly questionsService = inject(QuestionsService);
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  diplomas: Daum[] = [];
  exams: Exam[] = [];
  questions: Question[] = [];
  editingId: string | null = null;
  isLoadingDiplomas = true;
  isLoadingExams = false;
  isLoadingQuestions = false;
  isSaving = false;
  isBulkSaving = false;
  errorMessage = '';
  successMessage = '';

  readonly filterForm = this.fb.nonNullable.group({
    diplomaId: ['', Validators.required],
    examId: ['', Validators.required],
    search: [''],
  });

  readonly questionForm = this.fb.nonNullable.group({
    text: ['', Validators.required],
    answer1: ['', Validators.required],
    answer2: ['', Validators.required],
    answer3: [''],
    answer4: [''],
    correctIndex: [0, Validators.required],
  });

  readonly bulkForm = this.fb.nonNullable.group({
    questionsJson: [''],
  });

  ngOnInit(): void {
    this.loadDiplomas();
  }

  loadDiplomas(): void {
    this.isLoadingDiplomas = true;
    this.diplomasService.getAllDiplomas().subscribe({
      next: ({ payload }) => {
        this.diplomas = payload?.data ?? [];
        this.isLoadingDiplomas = false;
        if (this.diplomas.length) {
          this.filterForm.controls.diplomaId.setValue(this.diplomas[0].id);
          this.loadExams();
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load diplomas.';
        this.isLoadingDiplomas = false;
      },
    });
  }

  loadExams(): void {
    const diplomaId = this.filterForm.controls.diplomaId.value;
    if (!diplomaId) return;

    this.isLoadingExams = true;
    this.exams = [];
    this.questions = [];
    this.resetQuestionForm();
    this.examsService.getDiplomaExams(diplomaId).subscribe({
      next: ({ payload }) => {
        this.exams = payload?.data ?? [];
        this.isLoadingExams = false;
        const firstExamId = this.exams[0]?.id ?? '';
        this.filterForm.controls.examId.setValue(firstExamId);
        if (firstExamId) this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Unable to load exams.';
        this.isLoadingExams = false;
      },
    });
  }

  loadQuestions(): void {
    const examId = this.filterForm.controls.examId.value;
    if (!examId) return;

    this.isLoadingQuestions = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.questionsService.getExamQuestions(examId, {
      search: this.filterForm.controls.search.value,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }).subscribe({
      next: ({ payload }) => {
        this.questions = payload?.questions ?? [];
        this.isLoadingQuestions = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load questions.';
        this.isLoadingQuestions = false;
      },
    });
  }

  editQuestion(question: Question): void {
    const answers = question.answers ?? [];
    const correctIndex = Math.max(0, answers.findIndex((answer) => answer.isCorrect));
    this.editingId = question.id;
    this.questionForm.patchValue({
      text: question.text,
      answer1: answers[0]?.text ?? '',
      answer2: answers[1]?.text ?? '',
      answer3: answers[2]?.text ?? '',
      answer4: answers[3]?.text ?? '',
      correctIndex,
    });
  }

  resetQuestionForm(): void {
    this.editingId = null;
    this.questionForm.reset({ text: '', answer1: '', answer2: '', answer3: '', answer4: '', correctIndex: 0 });
  }

  saveQuestion(): void {
    if (this.questionForm.invalid || this.isSaving) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const examId = this.filterForm.controls.examId.value;
    if (!examId) {
      this.errorMessage = 'Please choose an exam first.';
      return;
    }

    const payload = this.buildQuestionPayload();
    if (!payload) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const request = this.editingId
      ? this.questionsService.updateQuestion(this.editingId, payload)
      : this.questionsService.createQuestion(examId, payload);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = this.editingId ? 'Question updated successfully.' : 'Question created successfully.';
        this.resetQuestionForm();
        this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Unable to save question. Make sure it has at least two answers and exactly one correct answer.';
        this.isSaving = false;
      },
    });
  }

  saveBulkQuestions(): void {
    const examId = this.filterForm.controls.examId.value;
    if (!examId || this.isBulkSaving) return;

    let questions: QuestionPayload[];
    try {
      questions = JSON.parse(this.bulkForm.controls.questionsJson.value || '[]') as QuestionPayload[];
    } catch {
      this.errorMessage = 'Bulk JSON is invalid.';
      return;
    }

    if (!Array.isArray(questions) || !questions.length || questions.some((question) => !this.isValidQuestionPayload(question))) {
      this.errorMessage = 'Bulk data must be an array of questions. Each question needs text, 2+ answers, and exactly one correct answer.';
      return;
    }

    this.isBulkSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.questionsService.bulkCreateQuestions(examId, questions).subscribe({
      next: () => {
        this.isBulkSaving = false;
        this.successMessage = 'Bulk questions created successfully.';
        this.bulkForm.reset({ questionsJson: '' });
        this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Unable to create bulk questions.';
        this.isBulkSaving = false;
      },
    });
  }

  deleteQuestion(question: Question): void {
    if (question.immutable) return;
    if (!window.confirm('Delete this question?')) return;

    this.questionsService.deleteQuestion(question.id).subscribe({
      next: () => {
        this.questions = this.questions.filter(({ id }) => id !== question.id);
        if (this.editingId === question.id) this.resetQuestionForm();
      },
      error: () => {
        this.errorMessage = 'Unable to delete question.';
      },
    });
  }

  toggleImmutable(question: Question): void {
    this.adminService.setQuestionImmutable(question.id, !question.immutable).subscribe({
      next: () => {
        question.immutable = !question.immutable;
      },
      error: () => {
        this.errorMessage = 'Unable to update immutable state.';
      },
    });
  }

  fillBulkExample(): void {
    this.bulkForm.controls.questionsJson.setValue(JSON.stringify([
      {
        text: 'What does CSS stand for?',
        answers: [
          { text: 'Cascading Style Sheets', isCorrect: true },
          { text: 'Creative Style System', isCorrect: false },
          { text: 'Computer Styled Sections', isCorrect: false },
        ],
      },
    ], null, 2));
  }

  private buildQuestionPayload(): QuestionPayload | null {
    const value = this.questionForm.getRawValue();
    const answerTexts = [value.answer1, value.answer2, value.answer3, value.answer4]
      .map((text) => text.trim())
      .filter(Boolean);

    if (answerTexts.length < 2) {
      this.errorMessage = 'Question must have at least two answers.';
      return null;
    }

    if (value.correctIndex < 0 || value.correctIndex >= answerTexts.length) {
      this.errorMessage = 'Correct answer must point to a filled answer.';
      return null;
    }

    return {
      text: value.text.trim(),
      answers: answerTexts.map((text, index) => ({ text, isCorrect: index === value.correctIndex })),
    };
  }

  private isValidQuestionPayload(question: QuestionPayload): boolean {
    const answers = question?.answers ?? [];
    return Boolean(question?.text?.trim()) && answers.length >= 2 && answers.filter((answer) => answer.isCorrect).length === 1 && answers.every((answer) => Boolean(answer.text?.trim()));
  }
}