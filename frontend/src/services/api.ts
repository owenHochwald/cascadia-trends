// src/services/api.ts
import axios from 'axios';
// import { buildQueryString } from '../utils/queryStringBuilder';
// import { FilterState } from '../types/common.types';

const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8000';

export const fetchSummaryData = async (filters: FilterState) => {
    const queryString = buildQueryString(filters);
    const response = await axios.get(`${BASE_URL}/summary${queryString}`);
    return response.data;
};

export const fetchScatterData = async (filters: FilterState) => {
    const queryString = buildQueryString(filters);
    const response = await axios.get(`${BASE_URL}/scatter${queryString}`);
    return response.data;
};

// TODO: keep writing api routes to backend methods