eventManager("simple test").listen(function () {
    console.log("test: first listener");
});

setTimeout(function () {
    eventManager("simple test").emit();
    eventManager("simple test2").emit();
}, 500);

setTimeout(function () {
    eventManager("simple test2").listen(function () {
        console.log("test2 listener (I should fire later, after Mr. once)");
    });
    eventManager("simple test2").once(function () {
        console.log("test2 once");
    });
}, 1000);

setTimeout(function () {
    eventManager("simple test2").emit();
}, 1500);


eventManager("multiple one, multiple two").listen(function () {
    console.log("multiple: first and second listener");
});

    
eventManager("multiple one, multiple two, multiple three").listen(function () {
    console.log("multiple three");
});

eventManager("multiple one").listen(function () {
    console.log("multiple: first listener");
});

setTimeout(function () {
    eventManager("multiple one, multiple two").emit();
}, 2000);

setTimeout(function () {
    eventManager("multiple three").emit();
}, 2500);