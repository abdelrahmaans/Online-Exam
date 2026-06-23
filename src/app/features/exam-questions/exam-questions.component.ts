import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DiplomasService } from '../../core/services/diplomas/diplomas.service';
import { QuestionsService } from '../../core/services/questions/questions.service';
import { SubmissionsService } from '../../core/services/submissions/submissions.service';
import { Question, SubmissionAnswer } from '../../core/models/question.interface';

@Component({
    selector: 'app-exam-questions',
    imports: [FormsModule, RouterLink, TitleCasePipe],
    templateUrl: './exam-questions.component.html',
    styleUrl: './exam-questions.component.css',
})
export class ExamQuestionsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly diplomasService = inject(DiplomasService);
    private readonly questionsService = inject(QuestionsService);
    private readonly submissionsService = inject(SubmissionsService);

    readonly examId = this.route.snapshot.paramMap.get('examId') ?? 'css';
    readonly diplomaId = this.route.snapshot.queryParamMap.get('diplomaId') ?? 'frontend';
    diplomaTitle = 'Diploma';
    questions: Question[] = [];
    currentQuestionIndex = 0;
    totalQuestions = 0;
    selectedAnswers: Map<string, string> = new Map();
    isSubmitting = false;
    isLoading = true;
    loadError = '';
    hoveredAnswerId: string | null = null;

    get currentQuestion(): Question | undefined {
        return this.questions[this.currentQuestionIndex];
    }

    ngOnInit(): void {
        this.loadDiplomaTitle();
        this.loadQuestions();
    }

    private loadDiplomaTitle(): void {
        this.diplomasService.getDiplomasById(this.diplomaId).subscribe({
            next: (response) => {
                this.diplomaTitle = response.payload?.data?.[0]?.title ?? 'Diploma';
            },
            error: () => {
                this.diplomaTitle = 'Diploma';
            },
        });
    }

    private loadQuestions(): void {
        this.questionsService.getExamQuestions(this.examId).subscribe({
            next: (response) => {
                this.questions = response.payload?.questions ?? [];
                this.totalQuestions = this.questions.length;
                this.isLoading = false;
                this.loadError = '';
            },
            error: () => {
                this.questions = [];
                this.totalQuestions = 0;
                this.isLoading = false;
                this.loadError = 'Unable to load questions. Please try again later.';
            },
        });
    }

    get progressWidth(): string {
        if (this.totalQuestions === 0) return '0%';
        return `${Math.round(((this.currentQuestionIndex + 1) / this.totalQuestions) * 100)}%`;
    }

    selectAnswer(answerId: string): void {
        if (this.currentQuestion) {
            this.selectedAnswers.set(this.currentQuestion.id, answerId);
        }
    }

    isAnswerSelected(answerId: string): boolean {
        return this.currentQuestion ? this.selectedAnswers.get(this.currentQuestion.id) === answerId : false;
    }

    previousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    nextQuestion(): void {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.currentQuestionIndex++;
        }
    }

    submitExam(): void {
        if (this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;
        const answers: SubmissionAnswer[] = Array.from(this.selectedAnswers.entries()).map(([questionId, answerId]) => ({
            questionId,
            selectedId: answerId,
        }));

        this.submissionsService.submitExam({
            examId: this.examId,
            answers,
        }).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.router.navigate(['/exams', this.examId, 'results'], {
                    queryParams: { diplomaId: this.diplomaId },
                    state: { result: response.payload },
                });
            },
            error: (err) => {
                console.error('Failed to submit exam', err);
                this.isSubmitting = false;
            },
        });
    }

    isQuestionAnswered(): boolean {
        return this.currentQuestion ? this.selectedAnswers.has(this.currentQuestion.id) : false;
    }
}
