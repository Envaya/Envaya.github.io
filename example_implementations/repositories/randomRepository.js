// DATA
import "../../src/doc/serviceDoc.js";
import { RandomNumber, RandomString } from "../../src/util/util.mjs";

/**
 * Creates a data set of entries
 * @constructor
 * @return ....
 */
const RandomRepository = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cities = ["Tokyo", "Osaka", "Kyoto", "Kobe", "Nagano"];

    const generateData = batchSize => {
        const entriesProxy = []
        for (let i = 0; i < batchSize; i++) {
            const person = {
                id:   i + 1,
                name: RandomString(characters, RandomNumber(3, 13)),
                age:  RandomNumber(1, 80),
                age2: RandomNumber(1, 80),
                age3: RandomNumber(1, 80),
                age4: RandomNumber(1, 80),
                age5: RandomNumber(1, 80),
                city: cities[Math.floor(Math.random() * cities.length)]
            }
            entriesProxy.push(person);
        }
        return entriesProxy;
    }

    return {
        getData: size => generateData(size)
    }
}

export { RandomRepository }