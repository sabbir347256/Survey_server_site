export interface ISurvey {
  _id?: string;
  surveyId: string;
  name: string;
  cpi: number;
  loi: number;
  isActive: boolean;
}

export interface IStartSurveyPayload {
  surveyId: string;
  employeeId: string;
}

export interface IApiResponse<T> {
  success: boolean;
  surveys?: T;
  entryLink?: string;
  error?: string;
}