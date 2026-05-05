


export async function delay(ms: number = 1500){
    if(process.env.NODE_ENV === "development"){
        await new Promise((reslove) => setTimeout(reslove, ms))
    }
}