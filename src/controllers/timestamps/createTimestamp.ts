export async function createTimestamp(req: any, res: any) {
    try {
        const { db } = req.app;
        const { name, timestamp } = req.body;
        const parsedTimestamp = new Date(timestamp);

        console.log("createTimestamp---name: " + name);
        console.log("createTimestamp---timestamp: " + timestamp);
        console.log("createTimestamp---parsedTimestamp: " + parsedTimestamp);

        if (!timestamp) {
            return res.status(400).json({ message: 'Timestamp is required' });
        }
        if (isNaN(parsedTimestamp.getTime())) {
            return res.status(400).json({ message: 'Timestamp format is wrong' });
        }

        const date = parsedTimestamp.getFullYear() + "-" + parsedTimestamp.getMonth() + 1 + "-" + parsedTimestamp.getDate();
        console.log("createTimestamp---date: " + date);

        const creationDateplaceholder = "2024-01-27";

        
        const result = await db.collection('timestamps').updateOne(
            { "date":  date},
            {
                $push: {
                    timestamps: {
                        type: "Platzhalter",
                        time: parsedTimestamp
                    }
                }
            }
        );
        

        if (result.acknowledged) {
            res.status(200).json({ message: 'Timestamp created' });
        }
        else {
            throw new Error('Timestamp not created');
        }

    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}