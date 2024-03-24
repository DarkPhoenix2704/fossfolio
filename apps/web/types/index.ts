import { IFormInput } from '@app/views/form';

export interface Child {
    children: React.ReactNode;
}

export interface User {
    uid: string;
    displayName: string;
    email: string;
    slug: string;
    photoURL: string;
    isStudent: boolean;
    collegeName?: string;
    refreshToken: string;
}

export type Member = {
    user: {
        uid: string;
        email: string;
        displayName: string;
        slug: string;
    };
    role: Roles;
};

type Organization = {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        members: number;
        events: number;
    };
};

export interface IOrg {
    ok: boolean;
    message: string;
    data: {
        organization: Organization;
        role: Roles;
    }[];
}

export enum Roles {
    Admin = 'ADMIN',
    Editor = 'EDITOR',
    Viewer = 'VIEWER',
}

export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface OrgEvents {
    id: string;
    name: string;
    website: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
    description: string | null;
    lastDate: Date;
    eventDate: Date;
    maxTicketCount?: number;
    minTicketCount?: number;
    isCollegeEvent?: boolean;
    coverImage?: string;
    isFormPublished: boolean;
    form: Iform[];
    slug: string;
}

export type Iform = {
    label: string;
    placeholder?: string;
    options?: string;
    required: boolean;
    type: IFormInput;
    id?: string;
};
