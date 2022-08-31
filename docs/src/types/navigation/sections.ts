export interface MenuSection {
    label: string;
    icon?: string;
    uri: string;
    sections?: SubSection[];
}

export interface SubSection {
    label: string;
    uri: string;
    sections?: SubSection[];
}