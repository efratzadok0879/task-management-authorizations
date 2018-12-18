export class ChangePassword {

    constructor(
        public userId: number,
        public token: string,
        public sendingDate:Date,
        public attempNum:number
    ) { }
    
}