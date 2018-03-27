interface P{
    name:string
}


class Pe{

}

function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}