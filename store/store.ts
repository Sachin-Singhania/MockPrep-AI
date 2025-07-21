import { create } from 'zustand'

type User = {
  userId: string
  dashboardId: string
  name: string | null
  email: string
  profilePic: string | null
}
export interface Profile extends Resume {
  profileId: string | undefined
  about: string | undefined
  tagline: string | undefined
  interview: {
    id: string;
    startTime: Date;
    endTime: Date | null;
    Analytics: {
      id: string;
      overallScore: number;
    } | null;
  }[] | null
}

type MockPrep = {
  user: User | null;
  profile: Profile | null;
  interview: interviewDetails | null;
  allAnalytics: Record<string, InterviewData>;
  addOrUpdateAnalytics: (id: string, data: InterviewData) => void;
  setUser: (user: User) => void;
  setProfile: (profile : Profile) => void;
  setInterview: (interview: interviewDetails) => void;
  addInterviewMessage: (message: InterviewChat) => void;
  resetStore: () => void;
  updateProfilePic: (profilePic: string) => void;
   updateSkills : (skills: Set<string>) => void;
   updateWorkExp : (workExp: Experience[]) => void;
   updateProjects : (projects: Project[]) => void;
};

export const useChatStore = create<MockPrep>((set, get) => ({
  user: null,
  profile: null,
  interview: null,
  allAnalytics: {},
  setUser: (user) => set({ user }),
  setProfile : (profile) => set({ profile }),
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
          ...state.allAnalytics,
          [id]: data,
      },
    })),
  resetStore: () => set({ user: null, profile: null, interview: null }),
  updateProfilePic(profilePic: string) {
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          profilePic
        }
      }
    });
  },
  updateSkills(skills: Set<string>) {
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          Skills: new Set([...state.profile.Skills, ...skills])
        }
      }
    })
  },
  updateWorkExp(experience: Experience[]) {
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          WorkExperience: [...state.profile.WorkExperience, ...experience]
        }
      }
    })
  },
  updateProjects( projects: Project[]) {
      set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          Projects: [...state.profile.Projects, ...projects]
        }
      }
    })
  }
}));
