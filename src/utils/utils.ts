import {compareSync, hashSync, genSaltSync} from 'bcryptjs';


export function encryptPassword(password: string) {
    const salt = genSaltSync(10); //כמות הפעמים שהוא יעשה רנדומליות של סיבובים כדי לייצר את המפתח כלל שיש יותר סיבובים ככה המפתח יהיה יותר מאובטח
    const hash = hashSync(password, salt);
    return hash;
}

export function decryptPassword(password: string ,hash: string) : boolean{
    return compareSync(password, hash);
}