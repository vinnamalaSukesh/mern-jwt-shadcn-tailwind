import { create } from "zustand";

const useAgent = create((set) => ({
    agents: [],

    setAgents: (Agents) => set({ agents: Agents }),

    addAgent: (Agent) => set((state) => ({agents: [...state.agents, Agent]})),

    deleteAgent: (AgentId) => set((state) => ({
        agents: state.agents.filter((agent) => agent._id !== AgentId)
    })),

    updateAgent: (Agent) => set((state) => ({
        agents: state.agents.map((agent) =>
            agent._id === Agent._id ? Agent : agent)})),

    setAgentTasks: (AgentId, TaskIds) => set((state) => ({
        agents: state.agents.map((agent) =>
            agent._id === AgentId ? { ...agent, tasks: TaskIds } : agent)})),

    addAgentTask: (AgentId, TaskId) => set((state) => ({
        agents: state.agents.map((agent) =>
            agent._id === AgentId ? { ...agent, tasks: [...agent.tasks, TaskId] } : agent)})),

    removeAgentTask: (AgentId, TaskId) => set((state) => ({
        agents: state.agents.map((agent) => agent._id === AgentId
                ? { ...agent, tasks: agent.tasks.filter((task) => task !== TaskId) }: agent)
    }))
}));

export default useAgent;
