import { processQuery } from "./src/agent/agent";

async function test() {
    processQuery("send 0.01 eth to 0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4")
        .then(textresponse => {
            console.log(`${textresponse}`)
            console.log("✅ Test completed!")
        })
        .catch((err) => console.error("❌ Error:", err));
}

test();