class User {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    showName(){
        console.log(this.name);
    }
    showName22(){
        console.log(this.name);
    }
}

class BB extends User{
    showName22(color){
        console.log(color);
    }
}

const tom = new User("tom", 30);

console.log(tom.showName22());
console.log(tom.showName22("blue"));
