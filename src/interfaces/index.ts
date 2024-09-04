export interface OutputData {
    out: number;
    level: boolean;
}

export interface ACData{
    outputNum: number;
    outputLevel: boolean;
    temp: number;
    mode: string
}

export interface TVData {
    outputNum: number;
    outputLevel: boolean;
    canal: 'UP' | 'DOWN';
    volume: '+' | '-';
}

export interface OutputDataTimed {
    outputNum: number;
    time: number;
}

export interface RGBData {
    outputNum: number;
    color: number;
}

export interface ModuleCommand {
    commandType: 'SetOutput' | 'SetOutputTimed' | 'SetColor' | 'IsThereSomebody' 
    | 'TurnOnTV' | 'TurnOffTV' | 'OnOffTV' | 'TurnOnAC' | 'TurnOffAC' | 'SetTempAC' | 'SetModeAC' | 'IncreaseTv'| 'DecreaseTv';
    data: OutputData | OutputDataTimed | RGBData | ACData |null;
}

export interface EventInput {
    inputType: string;
    eventType: string;
    mac: string;
    inputNum: number;
}

export interface Module {
    group: 'RelayModule' | 'IRGBModule';
    type: 'LIV10' | 'LIV8' | 'LIV4' | 'LIV1' | 'IRGB';
    mac: string;
    ip: string;
    deviceName: string;
}