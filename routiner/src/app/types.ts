export interface Task {
    title: string; 
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
}

export type TaskInput = Omit<Task, 'id'>;

export interface Event {
    title: string;
    id: string;
    description?: string;
    location?: string;
    url?: string;
    date: Date;
    startTime: string;
    endTime: string;
    repeat?: string;
}

export type EventInput = Omit<Event, 'id'>;

export interface Routine {
    title: string;
    id: string;
    daily: boolean;
    repeat: string[]; 
    startTime?: string;
    endTime?: string;
    subissue?: string;
}

export type RoutineInput = Omit<Routine, 'id'>;

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  routines: string[];
  events: string[];
  tasks: Task[];
}