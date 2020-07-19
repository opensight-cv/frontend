export interface NetworkSettings {
    team: string, 
    mode: string,
    dhcp: boolean,
    static_ext: string,
    nt_enabled: boolean,
    nt_client: boolean,
}

export interface Preferences {
    profile: number,
    network: NetworkSettings,
}

export interface Status {
    network_mode: string[],
    daemon: boolean,
    nt: boolean,
    netconf: boolean,
    version: string,
}

export interface FrontendSettings {
    preferences: Preferences,
    status: Status,
}