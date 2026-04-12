"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { currentUser, teamMembers } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { getAvatarLabel } from "@/lib/auth/roles";
import { appEnv, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  ActivityEvent,
  AppNotification,
  Organization,
  Role,
  UserPreferences,
  UserPresence,
  UserProfile
} from "@/types";

const PROFILES_STORAGE_KEY = "workingparts:profiles";
const NOTIFICATIONS_STORAGE_KEY = "workingparts:notifications";
const ACTIVITY_STORAGE_KEY = "workingparts:activity";
const PREFERENCES_STORAGE_KEY = "workingparts:preferences";
const PRESENCE_STORAGE_KEY = "workingparts:presence";

interface WorkspaceContextValue {
  organization: Organization;
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  notifications: AppNotification[];
  unreadNotifications: number;
  activity: ActivityEvent[];
  presence: UserPresence[];
  preferences: UserPreferences | null;
  hydrated: boolean;
  syncCurrentUserProfile: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  recordActivity: (event: Omit<ActivityEvent, "id" | "createdAt" | "actorAvatar">) => Promise<void>;
  pushNotification: (notification: Omit<AppNotification, "id" | "createdAt" | "readAt">) => Promise<void>;
  savePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
}

const fallbackOrganization: Organization = {
  id: "org-default",
  name: appEnv.companyName,
  slug: appEnv.companyName.toLowerCase().replace(/\s+/g, "-")
};

const seedProfiles: UserProfile[] = [currentUser, ...teamMembers.filter((member) => member.id !== currentUser.id)].map((member) => ({
  id: member.id,
  fullName: member.name,
  email: member.email,
  role: member.role,
  avatar: member.avatar,
  avatarUrl: member.avatarUrl,
  organizationId: fallbackOrganization.id,
  organizationName: fallbackOrganization.name,
  title: member.role === "admin" ? "Administracion" : member.role === "supervisor" ? "Supervisor de servicio" : "Tecnico",
  department: "Operaciones IT",
  isOnline: false,
  lastActiveAt: null,
  authSource: member.authSource ?? "local"
}));

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStorage<T>(key: string, fallback: T) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function buildProfile({
  id,
  fullName,
  email,
  role,
  avatarUrl,
  authSource
}: {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  authSource?: "local" | "supabase";
}): UserProfile {
  return {
    id,
    fullName,
    email,
    role,
    avatar: getAvatarLabel(fullName, email),
    avatarUrl,
    organizationId: fallbackOrganization.id,
    organizationName: fallbackOrganization.name,
    title: role === "admin" ? "Administracion" : role === "supervisor" ? "Supervisor de servicio" : "Tecnico",
    department: "Operaciones IT",
    isOnline: true,
    lastActiveAt: new Date().toISOString(),
    authSource
  };
}

function normalizePreferences(userId: string, current: Partial<UserPreferences> | null | undefined): UserPreferences {
  return {
    userId,
    favoriteView: current?.favoriteView ?? "/app/dashboard",
    lastVisitedRoute: current?.lastVisitedRoute ?? "/app/dashboard",
    recentClients: current?.recentClients ?? [],
    recentTechnicians: current?.recentTechnicians ?? [],
    recentSearches: current?.recentSearches ?? [],
    savedReportFilters: current?.savedReportFilters ?? {
      query: "",
      status: "Todos",
      priority: "Todas",
      category: "Todas",
      sortBy: "recent",
      compactView: false,
      showExtraColumns: true
    },
    reportDraft: current?.reportDraft ?? null,
    reducedMotion: current?.reducedMotion ?? false,
    compactTables: current?.compactTables ?? false,
    savedFilters: current?.savedFilters ?? [],
    recentClientIds: current?.recentClientIds ?? [],
    recentReportIds: current?.recentReportIds ?? []
  };
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, hydrated: authHydrated } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>(seedProfiles);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [presence, setPresence] = useState<UserPresence[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const lastActivityRef = useRef<string | null>(null);
  const supabaseEnabled = isSupabaseConfigured();

  const persistLocalState = useCallback(
    (next: {
      profiles?: UserProfile[];
      notifications?: AppNotification[];
      activity?: ActivityEvent[];
      presence?: UserPresence[];
      preferences?: UserPreferences | null;
    }) => {
      if (supabaseEnabled) return;
      if (next.profiles) window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next.profiles));
      if (next.notifications) window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next.notifications));
      if (next.activity) window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next.activity));
      if (next.presence) window.localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(next.presence));
      if (next.preferences) {
        const existing = readStorage<Record<string, UserPreferences>>(PREFERENCES_STORAGE_KEY, {});
        existing[next.preferences.userId] = next.preferences;
        window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(existing));
      }
    },
    [supabaseEnabled]
  );

  useEffect(() => {
    if (!authHydrated) return;

    if (!supabaseEnabled) {
      const localProfiles = readStorage<UserProfile[]>(PROFILES_STORAGE_KEY, seedProfiles);
      const localNotifications = readStorage<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, []);
      const localActivity = readStorage<ActivityEvent[]>(ACTIVITY_STORAGE_KEY, []);
      const localPresence = readStorage<UserPresence[]>(PRESENCE_STORAGE_KEY, []);
      const localPreferences = readStorage<Record<string, UserPreferences>>(PREFERENCES_STORAGE_KEY, {});

      setProfiles(localProfiles);
      setNotifications(localNotifications);
      setActivity(localActivity);
      setPresence(localPresence);
      setPreferences(user ? normalizePreferences(user.id, localPreferences[user.id]) : null);
      setHydrated(true);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase || !user) {
      setPreferences(user ? normalizePreferences(user.id, null) : null);
      setHydrated(true);
      return;
    }

    let cancelled = false;

    const loadCloudState = async () => {
      try {
        const [profilesResult, presenceResult, notificationsResult, activityResult, preferencesResult] = await Promise.all([
          supabase.from("profiles").select("*").order("full_name", { ascending: true }),
          supabase.from("user_presence").select("*").order("updated_at", { ascending: false }),
          supabase.from("notifications").select("*").eq("recipient_user_id", user.id).order("created_at", { ascending: false }).limit(20),
          supabase.from("recent_activity").select("*").order("created_at", { ascending: false }).limit(20),
          supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle()
        ]);

        if (cancelled) return;

        if (!profilesResult.error && profilesResult.data) {
          setProfiles(
            profilesResult.data.map((item: any) => ({
              id: item.id,
              fullName: item.full_name,
              email: item.email,
              role: item.role,
              avatar: getAvatarLabel(item.full_name, item.email),
              avatarUrl: item.avatar_url ?? undefined,
              organizationId: item.organization_id,
              organizationName: fallbackOrganization.name,
              title: item.job_title ?? undefined,
              department: item.department ?? undefined,
              phone: item.phone ?? undefined,
              isOnline: false,
              lastActiveAt: item.last_active_at,
              authSource: "supabase"
            }))
          );
        }

        if (!presenceResult.error && presenceResult.data) {
          setPresence(
            presenceResult.data.map((item: any) => ({
              userId: item.user_id,
              status: item.status,
              lastSeenAt: item.last_seen_at,
              updatedAt: item.updated_at
            }))
          );
        }

        if (!notificationsResult.error && notificationsResult.data) {
          setNotifications(
            notificationsResult.data.map((item: any) => ({
              id: item.id,
              userId: item.recipient_user_id,
              type: item.type,
              category: item.category,
              title: item.title,
              message: item.message,
              link: item.link ?? undefined,
              readAt: item.read_at,
              createdAt: item.created_at
            }))
          );
        }

        if (!activityResult.error && activityResult.data) {
          setActivity(
            activityResult.data.map((item: any) => ({
              id: item.id,
              actorUserId: item.actor_user_id,
              actorName: item.actor_name,
              actorAvatar: getAvatarLabel(item.actor_name),
              type: item.event_type,
              entityType: item.entity_type,
              entityId: item.entity_id,
              title: item.title,
              description: item.description,
              createdAt: item.created_at
            }))
          );
        }

        setPreferences(normalizePreferences(user.id, preferencesResult.data ?? null));
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void loadCloudState();

    return () => {
      cancelled = true;
    };
  }, [authHydrated, supabaseEnabled, user]);

  const syncCurrentUserProfile = useCallback(async () => {
    if (!user) return;

    const nextProfile = buildProfile({
      id: user.id,
      fullName: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      authSource: user.authSource
    });

    setProfiles((current) => {
      const existing = current.find((item) => item.id === user.id);
      const next = existing
        ? current.map((item) => (item.id === user.id ? { ...item, ...nextProfile, isOnline: true, lastActiveAt: nextProfile.lastActiveAt } : item))
        : [nextProfile, ...current];
      persistLocalState({ profiles: next });
      return next;
    });

    setPresence((current) => {
      const nextPresence: UserPresence = {
        userId: user.id,
        status: "online",
        lastSeenAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const next = current.some((item) => item.userId === user.id)
        ? current.map((item) => (item.userId === user.id ? nextPresence : item))
        : [nextPresence, ...current];
      persistLocalState({ presence: next });
      return next;
    });

    if (!supabaseEnabled) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    await Promise.allSettled([
      supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.name,
          role: user.role,
          avatar_url: user.avatarUrl ?? null,
          organization_id: fallbackOrganization.id,
          last_active_at: new Date().toISOString()
        },
        { onConflict: "id" }
      ),
      supabase.from("user_presence").upsert(
        {
          user_id: user.id,
          status: "online",
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id" }
      ),
      supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          favorite_view: preferences?.favoriteView ?? "/app/dashboard",
          last_visited_route: preferences?.lastVisitedRoute ?? "/app/dashboard",
          recent_clients: preferences?.recentClients ?? [],
          recent_technicians: preferences?.recentTechnicians ?? [],
          recent_searches: preferences?.recentSearches ?? [],
          saved_report_filters: preferences?.savedReportFilters ?? [],
          report_draft: preferences?.reportDraft ?? null,
          reduced_motion: preferences?.reducedMotion ?? false,
          compact_tables: preferences?.compactTables ?? false,
          saved_filters: preferences?.savedFilters ?? [],
          recent_client_ids: preferences?.recentClientIds ?? [],
          recent_report_ids: preferences?.recentReportIds ?? []
        },
        { onConflict: "user_id" }
      )
    ]);
  }, [persistLocalState, preferences, supabaseEnabled, user]);

  const recordActivity = useCallback<WorkspaceContextValue["recordActivity"]>(
    async (event) => {
      if (!user) return;
      const createdAt = new Date().toISOString();
      const nextEvent: ActivityEvent = {
        id: randomId("activity"),
        createdAt,
        actorAvatar: getAvatarLabel(event.actorName || user.name, user.email),
        ...event
      };

      if (lastActivityRef.current === `${event.type}:${event.entityId}:${event.title}`) {
        return;
      }

      lastActivityRef.current = `${event.type}:${event.entityId}:${event.title}`;

      setActivity((current) => {
        const next = [nextEvent, ...current].slice(0, 40);
        persistLocalState({ activity: next });
        return next;
      });

      if (!supabaseEnabled) return;
      const supabase = getSupabaseBrowserClient();
      await supabase?.from("recent_activity").insert({
        id: nextEvent.id,
        actor_user_id: nextEvent.actorUserId,
        actor_name: nextEvent.actorName,
        event_type: nextEvent.type,
        entity_type: nextEvent.entityType,
        entity_id: nextEvent.entityId,
        title: nextEvent.title,
        description: nextEvent.description,
        created_at: createdAt
      });
    },
    [persistLocalState, supabaseEnabled, user]
  );

  const pushNotification = useCallback<WorkspaceContextValue["pushNotification"]>(
    async (notification) => {
      const nextNotification: AppNotification = {
        id: randomId("notif"),
        createdAt: new Date().toISOString(),
        readAt: null,
        ...notification
      };

      setNotifications((current) => {
        const duplicate = current.find(
          (item) =>
            item.userId === nextNotification.userId &&
            item.title === nextNotification.title &&
            item.message === nextNotification.message &&
            item.readAt === null
        );
        const next = duplicate ? current : [nextNotification, ...current].slice(0, 40);
        persistLocalState({ notifications: next });
        return next;
      });

      if (!supabaseEnabled) return;
      const supabase = getSupabaseBrowserClient();
      await supabase?.from("notifications").insert({
        id: nextNotification.id,
        recipient_user_id: nextNotification.userId,
        type: nextNotification.type,
        category: nextNotification.category,
        title: nextNotification.title,
        message: nextNotification.message,
        link: nextNotification.link ?? null,
        created_at: nextNotification.createdAt
      });
    },
    [persistLocalState, supabaseEnabled]
  );

  const markNotificationRead = useCallback<WorkspaceContextValue["markNotificationRead"]>(
    async (id) => {
      const readAt = new Date().toISOString();
      setNotifications((current) => {
        const next = current.map((item) => (item.id === id ? { ...item, readAt } : item));
        persistLocalState({ notifications: next });
        return next;
      });

      if (!supabaseEnabled) return;
      const supabase = getSupabaseBrowserClient();
      await supabase?.from("notifications").update({ read_at: readAt }).eq("id", id);
    },
    [persistLocalState, supabaseEnabled]
  );

  const dismissNotification = useCallback<WorkspaceContextValue["dismissNotification"]>(
    async (id) => {
      setNotifications((current) => {
        const next = current.filter((item) => item.id !== id);
        persistLocalState({ notifications: next });
        return next;
      });

      if (!supabaseEnabled) return;
      const supabase = getSupabaseBrowserClient();
      await supabase?.from("notifications").delete().eq("id", id);
    },
    [persistLocalState, supabaseEnabled]
  );

  const savePreferences = useCallback<WorkspaceContextValue["savePreferences"]>(
    async (updates) => {
      if (!user) return;
      const next = normalizePreferences(user.id, { ...preferences, ...updates });
      setPreferences(next);
      persistLocalState({ preferences: next });

      if (!supabaseEnabled) return;
      const supabase = getSupabaseBrowserClient();
      await supabase?.from("user_preferences").upsert(
        {
          user_id: user.id,
          favorite_view: next.favoriteView,
          last_visited_route: next.lastVisitedRoute,
          recent_clients: next.recentClients,
          recent_technicians: next.recentTechnicians,
          recent_searches: next.recentSearches,
          saved_report_filters: next.savedReportFilters,
          report_draft: next.reportDraft,
          reduced_motion: next.reducedMotion,
          compact_tables: next.compactTables,
          saved_filters: next.savedFilters,
          recent_client_ids: next.recentClientIds,
          recent_report_ids: next.recentReportIds
        },
        { onConflict: "user_id" }
      );
    },
    [persistLocalState, preferences, supabaseEnabled, user]
  );

  useEffect(() => {
    if (!user || !authHydrated) return;
    void syncCurrentUserProfile();
  }, [authHydrated, syncCurrentUserProfile, user]);

  useEffect(() => {
    if (!user || !hydrated) return;

    const touchPresence = () => {
      void syncCurrentUserProfile();
    };

    const markAway = () => {
      setPresence((current) => {
        const nextStatus: UserPresence["status"] = document.hidden ? "away" : "online";
        const next = current.map((item) =>
          item.userId === user.id
            ? { ...item, status: nextStatus, lastSeenAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            : item
        );
        persistLocalState({ presence: next });
        return next;
      });
    };

    const intervalId = window.setInterval(touchPresence, 60000);
    window.addEventListener("focus", touchPresence);
    document.addEventListener("visibilitychange", markAway);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", touchPresence);
      document.removeEventListener("visibilitychange", markAway);
    };
  }, [hydrated, persistLocalState, syncCurrentUserProfile, user]);

  const currentProfile = useMemo(() => {
    if (!user) return null;

    return (
      profiles.find((item) => item.id === user.id) ??
      buildProfile({
        id: user.id,
        fullName: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        authSource: user.authSource
      })
    );
  }, [profiles, user]);

  const hydratedPresence = useMemo(() => {
    const map = new Map(presence.map((item) => [item.userId, item]));
    return profiles.map((profile) => {
      const item = map.get(profile.id);
      return {
        ...profile,
        isOnline: item?.status === "online",
        lastActiveAt: item?.lastSeenAt ?? profile.lastActiveAt
      };
    });
  }, [presence, profiles]);

  const unreadNotifications = notifications.filter((item) => !item.readAt).length;

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      organization: fallbackOrganization,
      profiles: hydratedPresence,
      currentProfile,
      notifications,
      unreadNotifications,
      activity,
      presence,
      preferences,
      hydrated,
      syncCurrentUserProfile,
      markNotificationRead,
      dismissNotification,
      recordActivity,
      pushNotification,
      savePreferences
    }),
    [
      activity,
      currentProfile,
      dismissNotification,
      hydrated,
      hydratedPresence,
      markNotificationRead,
      notifications,
      preferences,
      presence,
      pushNotification,
      recordActivity,
      savePreferences,
      syncCurrentUserProfile,
      unreadNotifications
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }

  return context;
}
