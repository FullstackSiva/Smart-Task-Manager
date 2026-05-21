export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string;
  category?:
  | 'Work'
  | 'Personal'
  | 'Learning'
  | 'Other';
  createdAt: Date;
  isArchived?: boolean;
}