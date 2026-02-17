import { eq, SQL } from 'drizzle-orm';
import { members } from '@/drizzle/schema';

interface UserScope {
    role: string;
    stateId: string | null;
    lgaId: string | null;
    parishId: string | null;
}

export function getScopedFilters(scope: UserScope): SQL[] {
    const filters: SQL[] = [];

    // Super admin sees everything
    if (scope.role === 'super_admin') {
        return filters;
    }

    // Apply hierarchical filtering
    if (scope.parishId) {
        filters.push(eq(members.parishId, scope.parishId));
    } else if (scope.lgaId) {
        filters.push(eq(members.lgaId, scope.lgaId));
    } else if (scope.stateId) {
        filters.push(eq(members.stateId, scope.stateId));
    }

    return filters;
}

// Ensure the filters are applied to a Drizzle query
// Usage:
// const filters = await getScopedFilters(userId);
// let query = db.select().from(members);
// if (filters.stateId) query.where(eq(members.stateId, filters.stateId));
// ...
