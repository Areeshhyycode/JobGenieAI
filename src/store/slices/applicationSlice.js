import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/applications?${params}`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  }
);

export const addApplication = createAsyncThunk(
  'applications/add',
  async (data) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add application');
    return res.json();
  }
);

export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ id, data }) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id) => {
    const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete application');
    return id;
  }
);

export const fetchStats = createAsyncThunk(
  'applications/fetchStats',
  async () => {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchApplications.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchApplications.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addApplication.fulfilled, (state, action) => { state.items.unshift(action.payload); })

      .addCase(updateApplication.fulfilled, (state, action) => {
        const index = state.items.findIndex((app) => app._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((app) => app._id !== action.payload);
      })

      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
