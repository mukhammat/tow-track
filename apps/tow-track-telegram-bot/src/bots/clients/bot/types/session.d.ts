// types/session.d.ts
export type OrderSession = {
    step: "location" | "vehicle" | "phone" | "done";
    data: {
      location?: string;
      vehicle?: string;
      phone?: string;
    };
  };
  