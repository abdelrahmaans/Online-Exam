import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DiplomasService } from '../../core/services/diplomas/diplomas.service';
import { SubmissionResult } from '../../core/models/question.interface';

@Component({
    selector: 'app-exam-results',
    imports: [RouterLink],
    templateUrl: './exam-results.component.html',
    styleUrl: './exam-results.component.css',
})
export class ExamResultsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly diplomasService = inject(DiplomasService);

    readonly examId = this.route.snapshot.paramMap.get('examId') ?? 'css';
    readonly diplomaId = this.route.snapshot.queryParamMap.get('diplomaId') ?? 'frontend';
    diplomaTitle = 'Diploma';

    score = {
        correct: 0,
        wrong: 0,
        total: 0,
    };

    answers: { question: string; selected: string; correct: string; isCorrect: boolean }[] = [];

    ngOnInit(): void {
        this.loadDiplomaTitle();
        const navigationResult = this.router.getCurrentNavigation()?.extras.state?.['result'] as SubmissionResult | undefined;
        this.setResult(navigationResult ?? history.state?.result);
    }

    private setResult(result: SubmissionResult | undefined): void {
        if (!result) {
            return;
        }

        this.score = {
            correct: result.submission.correctAnswers,
            wrong: result.submission.wrongAnswers,
            total: result.submission.totalQuestions,
        };

        this.answers = result.analytics.map((item) => ({
            question: item.questionText,
            selected: item.selectedAnswer?.text ?? 'No answer selected',
            correct: item.correctAnswer?.text ?? 'No correct answer available',
            isCorrect: item.isCorrect,
        }));
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


    get scorePercent(): number {
        return this.score.total === 0 ? 0 : Math.round((this.score.correct / this.score.total) * 100);
    }

    get progressWidth(): string {
        return this.score.total === 0 ? '0%' : `${Math.round((this.score.correct / this.score.total) * 100)}%`;
    }
}
