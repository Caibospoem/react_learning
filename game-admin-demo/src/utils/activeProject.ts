const ACTIVE_PROJECT_KEY = "activeProjectId";
export const PROJECT_CHANGED_EVENT = "project-changed";
export const PROJECT_LIST_CHANGED_EVENT = "project-list-changed";

export const getActiveProjectId = (): number | null => {
  const rawValue = localStorage.getItem(ACTIVE_PROJECT_KEY);
  if (!rawValue) {
    return null;
  }
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
};

export const setActiveProjectId = (projectId: number | null) => {
  if (projectId === null) {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  } else {
    localStorage.setItem(ACTIVE_PROJECT_KEY, String(projectId));
  }
  window.dispatchEvent(new CustomEvent(PROJECT_CHANGED_EVENT, { detail: projectId }));
};

export const notifyProjectListChanged = () => {
  window.dispatchEvent(new Event(PROJECT_LIST_CHANGED_EVENT));
};
