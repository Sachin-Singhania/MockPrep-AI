import { getStatus } from '@/lib/utils'
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
    Jobtitle: string
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
  questions : questionPerformance[] | null;
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
   addInterviewQuestion : (question: InterviewChat) => void;
   updateInterviewQuestion : (questionId:string,score:number) => void;
   ReplaceSkill : (skill: Set<string>) => void;
};

export const useChatStore = create<MockPrep>((set, get) => ({
  user: null,
  profile: null,
  interview: null,questions : [],
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
          Skills: new Set([...state.profile.Skills ?? [], ...skills])
        }
      }
    })
  },ReplaceSkill (skill: Set<string>) {
      set((state) => {
        if (!state.profile) return state;
        return {
          profile: {
            ...state.profile,
            Skills :new Set(skill)
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
          WorkExperience: [...state.profile.WorkExperience ?? [], ...experience]
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
          Projects: [...state.profile.Projects ?? [], ...projects]
        }
      }
    })
  },addInterviewQuestion(question) {
    set((state) => {
      const add:questionPerformance = {
        question : `Q${state.questions && state.questions.length>0 ? state.questions.length+1 : 1}`,
        topic : question.Content,
        id : question.id,
      }
      if (!state.interview) return state;
      return {
          questions : [...state.questions ?? [], add],
      }
      })
  },updateInterviewQuestion(questionId, score) {
       set ((state) => {
         if (!state.interview) return state;
        return{
             questions: state.questions?.map(q =>
      q.id === questionId
        ? {
            ...q,
            score,
            status: getStatus(score).status,
          }
        : q
    )
  }})
  },
}));
