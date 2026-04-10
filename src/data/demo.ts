import { Client, User, WorkReport } from "@/types";

export const currentUser: User = {
  id: "u-1",
  name: "Carlos Martin",
  role: "supervisor",
  email: "carlos.martin@ibersoft.es",
  avatar: "CM"
};

export const teamMembers: User[] = [
  currentUser,
  { id: "u-2", name: "Lucia Gomez", role: "technician", email: "lucia@ibersoft.es", avatar: "LG" },
  { id: "u-3", name: "Diego Ramos", role: "technician", email: "diego@ibersoft.es", avatar: "DR" },
  { id: "u-4", name: "Sara Ortega", role: "admin", email: "sara@ibersoft.es", avatar: "SO" }
];

export const clients: Client[] = [];

export const reports: WorkReport[] = [];
