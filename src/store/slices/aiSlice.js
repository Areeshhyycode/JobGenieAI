import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const createAIThunk = (name, endpoint) =>
  createAsyncThunk(`ai/${name}`, async (data, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.error || `Failed to generate ${name}`);
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  });

export const generateCoverLetter = createAIThunk('coverLetter', 'cover-letter');
export const generateInterviewQuestions = createAIThunk('interviewQuestions', 'interview-questions');
export const generateFollowUpEmail = createAIThunk('followUpEmail', 'follow-up-email');
export const generateMatchScore = createAIThunk('matchScore', 'match-score');
export const generateResumeTips = createAIThunk('resumeTips', 'resume-tips');

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    coverLetter: null,
    interviewQuestions: null,
    followUpEmail: null,
    matchScore: null,
    resumeTips: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAI: (state) => {
      state.coverLetter = null;
      state.interviewQuestions = null;
      state.followUpEmail = null;
      state.matchScore = null;
      state.resumeTips = null;
      state.error = null;
    },
    clearAIError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload || action.error.message; };

    builder
      .addCase(generateCoverLetter.pending, handlePending)
      .addCase(generateCoverLetter.fulfilled, (state, action) => { state.loading = false; state.coverLetter = action.payload; })
      .addCase(generateCoverLetter.rejected, handleRejected)

      .addCase(generateInterviewQuestions.pending, handlePending)
      .addCase(generateInterviewQuestions.fulfilled, (state, action) => { state.loading = false; state.interviewQuestions = action.payload; })
      .addCase(generateInterviewQuestions.rejected, handleRejected)

      .addCase(generateFollowUpEmail.pending, handlePending)
      .addCase(generateFollowUpEmail.fulfilled, (state, action) => { state.loading = false; state.followUpEmail = action.payload; })
      .addCase(generateFollowUpEmail.rejected, handleRejected)

      .addCase(generateMatchScore.pending, handlePending)
      .addCase(generateMatchScore.fulfilled, (state, action) => { state.loading = false; state.matchScore = action.payload; })
      .addCase(generateMatchScore.rejected, handleRejected)

      .addCase(generateResumeTips.pending, handlePending)
      .addCase(generateResumeTips.fulfilled, (state, action) => { state.loading = false; state.resumeTips = action.payload; })
      .addCase(generateResumeTips.rejected, handleRejected);
  },
});

export const { clearAI, clearAIError } = aiSlice.actions;
export default aiSlice.reducer;
