import { create } from 'zustand'

type User ={
  userId : string
  dashboardId : string
  name : string | null
  email : string
  profilePic : string | null
}
export interface Profile extends Resume {
  profileId: string |undefined
  about: string  | undefined
  tagline: string  | undefined
  interview : {
    id: string;
    startTime: Date;
    endTime: Date | null;
    Analytics: {
      id: string;
      overallScore: number;
    } | null;
  }[] | null
}
interface AllInterviewsAnalytics{
  InterviewData : Record<string,InterviewData>
}
type MockPrep = {
  user: User | null;
  profile: Profile | null;
  interview: interviewDetails | null;
  allAnalytics: AllInterviewsAnalytics;
  setUser: (user: User) => void;
  setProfile: (profile: Profile) => void;
  setInterview: (interview: interviewDetails) => void;
  addInterviewMessage: (message: InterviewChat) => void;
  resetStore: () => void;
  addOrUpdateAnalytics : (id:string, data: InterviewData) => void;
};

export const useChatStore = create<MockPrep>((set, get) => ({
  user: null,
  profile: null,
  interview: null,
  allAnalytics: { InterviewData: {} },
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setInterview: (interview) => set({ interview }),
  addInterviewMessage: (message) =>
    set((state) => {
      if (!state.interview) return state;
      return {
        interview: {
          ...state.interview,
          InterviewChatHistory: [...state.interview.InterviewChatHistory, message],
        },
      };
    }),
    addOrUpdateAnalytics: (id: string, data: InterviewData) =>
  set((state) => ({
    allAnalytics: {
      InterviewData: {
        ...state.allAnalytics.InterviewData,
        [id]: data,
      },
    },
  })),
  resetStore: () => set({ user: null, profile: null, interview: null }),
}));
