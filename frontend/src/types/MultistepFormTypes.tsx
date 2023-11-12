import React from 'react';


export interface MultiStepFormProps {
  show: boolean;
  handleClose: () => void;
}

export interface FormItemInterface {
  label: string;
  type: string;
  value: string;
  name: number;
  validation?: string;
  errorMessage?: string;
  elType?: string;
  id?: string;
}
  
export interface FormItemProps {
  item: FormItemInterface;
}

export interface FormProviderProps {
  children?: ReactNode
}

export interface Item {
  label: string;
  type: string;
  value: string;
  id: string;
  validation?: string;
}


export interface FormProps {
  questions: any;
  step: number;
  edit?: boolean;
  onHandleClose?: () => void;
}

export interface UserData {
  [index: string]: NonNullable<unknown>;
}

export interface MicroserviceData {
  [index: string]: NonNullable<unknown>;
}

export interface FormContextType {
  currentStep: number,
  setStep: React.Dispatch<React.SetStateAction<number>>
  userData: Record<string, NonNullable<unknown>>
  setUserData: React.Dispatch<React.SetStateAction<NonNullable<unknown>>>
  microserviceData: Record<string, NonNullable<unknown> | []>
  setMicroserviceData: React.Dispatch<React.SetStateAction<NonNullable<unknown>>>,
  submitData(func?: NonNullable<unknown>): void
}