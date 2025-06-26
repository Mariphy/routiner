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
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    subissue?: string;
    repeat?: string; 
}

export type RoutineInput = Omit<Routine, 'id'>;