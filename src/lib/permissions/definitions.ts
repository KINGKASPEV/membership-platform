export type Role = 'super_admin' | 'state_admin' | 'lga_admin' | 'parish_admin';

export type Resource =
    | 'members'
    | 'validation'
    | 'analytics'
    | 'settings'
    | 'users';

export type Action =
    | 'read'
    | 'create'
    | 'update'
    | 'delete'
    | 'validate'
    | 'export';

export type Scope = 'national' | 'state' | 'lga' | 'parish';

export type Permission = {
    resource: Resource;
    action: Action;
    scope: Scope;
};
