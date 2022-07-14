import fs from 'fs';

/* 1.
Lee los archivos del sistema (la base de datos y los nombres de los estados, ambos en formato csv) con codificación utf-8.
Encierra el contenido en un array y a su vez, cada fila (registro de cada ciudad) también es convertida en un array.
*/

const registros = fs.readFileSync('./database/database.csv', {
    encoding: 'utf-8'
})
.split('\r\n')
.map((row: string): string[]=>{
    return row.split(',');
});

const estados = fs.readFileSync('./database/estados.csv', {
    encoding: 'utf-8'
})
.split('\r\n');

/* 2.
Los Totales almacenan la sumatoria de muertes y la sumatoria de población por cada estado, respectivamente.
Los array muertes, población y relacionMP almacenan el valor total para cada estado, añadidos de acuerdo al índice del estado en cuestión.
*/

let mTotal = 0;
let pTotal = 0;

let muertes: number[] = [];
let poblacion: number[] = [];
let relacionMP: number[] = [];

/* 3.
Para cada uno de los elementos contenido en el array estados realiza una iteración sobre los registros y verifica que el valor almacenado
en la posición 1 (estado al que pertenece la ciudad) cumpla con la condición de ser estrictamente igual al elemento del ciclo principal, 
de ser así, van sumando parcialmente los valores almacenados en la posición 3 (muertes en la ciudad, dato acumulado en la fecha más reciente) 
o en la posición 2 (población de la ciudad, dato acumulado en la fecha más reciente), según sea el caso, hasta concluir la igualdad y almacenar estos
valores (de acuerdo al índice del estado en cuestión) dentro del array muertes o población.
*/

estados.forEach(function (value) {
    for (let registro of registros) {
        if (registro[1]===value) {
            mTotal += parseInt(registro[3]);
        }
        muertes[estados.indexOf(value)] = mTotal;
    }
    mTotal = 0;
}
);

estados.forEach(function (value) {
    for (let registro of registros) {
        if (registro[1]===value) {
            pTotal += parseInt(registro[2]);
        }
        poblacion[estados.indexOf(value)] = pTotal;
    }
    pTotal = 0;
}
);

/* 4.
Obtiene los índices de los estados con mayor y menor cantidad de muertes gracias a los métodos max() y min() del objeto Math.
*/

let masMuertes = muertes.indexOf(Math.max(...muertes));
let menosMuertes = muertes.indexOf(Math.min(...muertes));


/* 5.
Calcula las relaciones entre las muertes totales del estado frente al total de su población para cada uno de los estados.
*/

let afectacion = () => {
    for (let index = 0; index < estados.length; index++) {
        let relacion = muertes[index]*100/poblacion[index];
        relacionMP.push(relacion);
        console.log(`${estados[index]} presenta un ${relacionMP[index].toFixed(6)} % de muertes respecto a su población total de ${poblacion[index]} habitantes.`);
    }
    let masAfectado = relacionMP.indexOf(Math.max(...relacionMP));

    console.log(`\nEl estado más afectado hasta la fecha es ${estados[masAfectado]}. Debido a que la relación entre las muertes y el total de su población presenta el más alto porcentaje.\n`);
}

/* 5.
Presenta la solución.
*/

console.log(`El estado con más muertes por COVID es ${estados[masMuertes]} con ${muertes[masMuertes]} hasta el 27 de Abril del 2021.\n`);
console.log(`El estado con menos muertes por COVID es ${estados[menosMuertes]} con ${muertes[menosMuertes]} hasta el 27 de Abril del 2021.\n`);
afectacion();