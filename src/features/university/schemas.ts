import { z } from "zod";
export const moduleFormSchema=z.object({name:z.string().trim().min(1).max(160),code:z.string().max(40).optional(),lecturer:z.string().max(160).optional(),schedule:z.string().max(1000).optional(),current_topic:z.string().max(500).optional(),confidence_level:z.string().regex(/^\d+$/).refine(v=>Number(v)<=100),notes:z.string().max(5000).optional(),assignment_deadlines:z.string().max(3000).optional(),exam_dates:z.string().max(3000).optional()});
export type ModuleFormValues=z.infer<typeof moduleFormSchema>;
export const studySessionSchema=z.object({module_id:z.string().uuid(),duration_minutes:z.string().regex(/^\d+$/).refine(v=>Number(v)>0),topic:z.string().max(500).optional(),session_date:z.string().min(1),notes:z.string().max(3000).optional()});
export type StudySessionValues=z.infer<typeof studySessionSchema>;
