const app=new Vue({
    el:'#app',
    data(){
     return {
       countries:[],
       questions:[],
       incorrect:[false,false,false,false],
       correct:[false,false,false,false],
       translate:[],
       score:0,
       marked:false,
       capital:false,
       flag:false,
       zoom1:false,
       zoom2:false,
       slideUp:false,
       round:0,
       load:false,
       error:'input game rounds',
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
             location.reload();
        },
        gameOn(){
            this.setQuestions(this.countries);
            for(let i=0;i<this.round;i++){
                this.translate.push(false);
            }
            if((this.flag || this.capital) && this.round>=5){
                this.slideUp=true
                this.zoom2=this.capital;
                this.zoom1=this.flag;
                return;
            }
            if(!this.flag && !this.capital){
                this.error='please make a selection!!!'
                return;
            }
            if(this.round<5){
                this.error='round should be greater than 5'
            }
            console.log(typeof this.round)
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
       setQuestions(countries){
           for(let i=0;i<this.round;i++){
               this.questions.push(this.createQuestion(countries));
           }
       },
       markAnswer(i,j){
           if(!this.marked){
            this.marked=true;
            const answerIndex=this.questions[i].answerIndex
            this.correct=this.resetArray(this.correct,answerIndex);
            if(j!==answerIndex){
               this.incorrect=this.resetArray(this.incorrect,j);
            }else{
                this.incorrect=[false,false,false,false];
                this.score++;
            }
           }
       },
       resetArray(array,pickedIndex){
           let temp=[];
           array.forEach((element,index) => {
               if(index===pickedIndex){
                   temp.push(true);
               }
               else{
                   temp.push(false);
               }
           });
           return temp;
       },
       next(index){
          this.marked=false; 
          this.incorrect=[false,false,false,false];
          this.correct=[false,false,false,false];
          let temp=[];
          for(let i=0;i<this.round;i++){
              if(index===i || this.translate[i]){
                  temp.push(true);
              }
              else{
                  temp.push(false)
              }
          }
          this.translate=temp; 
          console.log(index) 
       },
       
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
        },
        loaded(){
            this.questions.forEach(question=>{
                if(question!==undefined){
                    this.load=true;
                    console.log(this.translate.length);
                    console.log(this.round);
                }
                else{
                    this.load=false
                }
              });
             return this.load;
        }
    },
    async mounted(){
      const res = await axios.get('https://restcountries.eu/rest/v2/all');
      this.countries=res.data;
    }
})