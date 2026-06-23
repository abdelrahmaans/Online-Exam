export interface QuestionsResponse {
    status: boolean;
    code: number;
    payload: QuestionsPayload;
}

export interface QuestionsPayload {
    questions: Question[];
}

export interface Question {
    id: string;
    title: string;
    text: string;
    examId: string;
    immutable: boolean;
    createdAt: string;
    updatedAt: string;
    answers: Answer[];
    exam: ExamRef;
}

export interface Answer {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface ExamRef {
    id: string;
    title: string;
}

export interface SubmissionPayload {
    examId: string;
    answers: SubmissionAnswer[];
}

export interface SubmissionAnswer {
    questionId: string;
    answerId: string;
}

export interface SubmissionResponse {
    status: boolean;
    code: number;
    payload: SubmissionResult;
}

export interface SubmissionResult {
    submission: ExamSubmission;
    analytics: SubmissionAnalytics[];
}

export interface ExamSubmission {
    id: string;
    examId: string;
    score: number | null;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
}

export interface SubmissionAnalytics {
    questionId: string;
    questionText: string;
    selectedAnswer: Answer | null;
    isCorrect: boolean;
    correctAnswer: Answer | null;
}
