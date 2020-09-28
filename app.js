const app=new Vue({
    el:'#app',
    data(){
     return {
       countries:[],
       questions:[],
       incorrect:[false,false,false,false],
       correct:[false,false,false,false],
       score:0,
       marked:false,
       capital:false,
       flag:false,
       zoom1:false,
       zoom2:false,
       slideUp:false,
       round:5,
       loaded:false,
       error:'input game rounds',
       played:0
    }
    },
    methods:{
        toggleOption(option){
             if(option==='flag'){
                 this.flag=true;
                 this.capital=false;
             }
             else{
                 this.flag=false;
                 this.capital=true;
             }
        },
        reset(){
            this.questions=[];
            this.score=0;
            this.capital=false;
            this.flag=false;
            this.zoom1=false;
            this.zoom2=false;
            this.slideUp=false;
            this.played=0;
        },
        gameOn(){
            if((this.flag || this.capital) && this.round>=5 && this.round<=200){
                this.slideUp=true
                this.zoom2=this.capital;
                this.zoom1=this.flag;
                this.setQuestions(this.questions,this.createQuestion(this.countries));
            }
            if(!this.flag && !this.capital){
                this.error='please make a selection!!!'
            }
            if(this.round<5){
                this.error="round can't be less than 5"
            }
            if(this.round>200){
                this.error="round can't be greater than 200"
            }
            this.loaded=true;
            
        },
        randomlySelectFourOptions(countries){
           let optionIndex=[];
           let options=[];
           while(options.length<4){
            const randomIndex=Math.floor(Math.random() * 250); 
            if(!optionIndex.includes(randomIndex) && countries[randomIndex]!==undefined && countries[randomIndex].capital!=="" && countries[randomIndex].flag!==""){
                 optionIndex.push(randomIndex);
                 options.push(countries[randomIndex]);
            }
           }
           return options;
       },
       answer(options,answerindex){
           return options[answerindex];
       },
       createQuestion(countries){
             const options=this.randomlySelectFourOptions(countries);
             const answerIndex=Math.floor(Math.random() * 4);
            //  removing answer from countries list
             let temp=[];
             this.countries.forEach((country,index)=>{
                 if(index!==answerIndex){
                     temp.push(country);
                 }
             });
             this.countries=temp;
             const answer=this.answer(options,answerIndex);
             const question={
                 options:options,
                 answer:answer,
                 answerIndex:answerIndex
             }
             return question;
       },
       setQuestions(questions,question){
           questions.push(question);
       },
       markAnswer(i,j){
           if(!this.marked){
            this.marked=true;
            const answerIndex=this.questions[i].answerIndex;
            this.correct.splice(answerIndex, 1, true);
            if(j!==answerIndex){
               this.incorrect.splice(j, 1, true);
            }else{
                this.incorrect=[false,false,false,false];
                this.score++;
            }
           }
       },
      slide(index){
           document.getElementById(`${index}`).classList.add('translate')
       },
        errorCheck(){
            if(this.round<5){
                this.error="round can't be less than 5"
            }
            else if(this.round>200){
                this.error="round can't be greater than 200"
            }
            else{
                this.error=`${this.round} rounds of game`;
            }
        },
       next(index){
           this.played++;
           this.slide(index);
           this.marked=false; 
           this.incorrect=[false,false,false,false];
           this.correct=[false,false,false,false];
           if(this.played<this.round){
            this.setQuestions(this.questions,this.createQuestion(this.countries));
           }
       } 
    },
    filters:{
        alphabet(value){
             switch(value){
                 case 0:
                  return 'A';
                 case 1:
                  return 'B';
                 case 2:
                  return 'C';
                 case 3:
                  return 'D'
             }
        },
    },
    computed:{
        grade(){
            const ratio=this.score/this.round;
            if(ratio>=0.7){
                return 'A'
            }
            else if(ratio>=0.6){
                 return 'B'
            }
            else if(ratio>=0.5){
                return 'C'
            }
            else if(ratio>=0.45){
                return 'D'
            }
            else if(ratio>=0.4){
                return 'E'
            }else {
                return 'F'
            }
        },
        gradeColor(){
            const ratio=1-(this.score/this.round);
            const redness=ratio*255;
            return `rgb(${redness},127.5,127.5)`
        }
    },
    async mounted(){
      const res = await axios.get('https://restcountries.eu/rest/v2/all');
      this.countries=res.data;
    }
})