import { Conversation, Message } from "@/types"

export const mockedEGMessage: Message = {
    "role": "earth.guide",
    "content": "Sure, here are three beaches in Europe with a brief description:\n\n**[Croatia - Zlatni Rat Beach](https://www.visitsplit.com/en/2075/zlatni-rat-beach)** is a stunning beach located on the southern coast of the island of Brač in Croatia. The beach is known for its unique shape, which changes depending on the direction of the wind and waves. The beach is surrounded by crystal-clear waters and pine trees, making it a popular spot for swimming and sunbathing.\n\n- ![Zlatni Rat Beach 1](https://images.placeholders.dev/?width=300&height=300&text=Zlatni+Rat+Beach+1)\n- ![Zlatni Rat Beach 2](https://images.placeholders.dev/?width=300&height=300&text=Zlatni+Rat+Beach+2)\n- ![Zlatni Rat Beach 3](https://images.placeholders.dev/?width=300&height=300&text=Zlatni+Rat+Beach+3)\n- ![Zlatni Rat Beach 4](https://images.placeholders.dev/?width=300&height=300&text=Zlatni+Rat+Beach+4)\n- ![Zlatni Rat Beach 5](https://images.placeholders.dev/?width=300&height=300&text=Zlatni+Rat+Beach+5)\n\n**[Portugal - Praia do Camilo](https://www.algarvefun.com/praia-do-camilo-beach/)** is a beautiful beach located in the Algarve region of Portugal. The beach is known for its clear waters, golden sand, and stunning rock formations. Visitors can access the beach by descending a long staircase, which offers breathtaking views of the coastline.\n\n- ![Praia do Camilo 1](https://images.placeholders.dev/?width=300&height=300&text=Praia+do+Camilo+1)\n- ![Praia do Camilo 2](https://images.placeholders.dev/?width=300&height=300&text=Praia+do+Camilo+2)\n- ![Praia do Camilo 3](https://images.placeholders.dev/?width=300&height=300&text=Praia+do+Camilo+3)\n- ![Praia do Camilo 4](https://images.placeholders.dev/?width=300&height=300&text=Praia+do+Camilo+4)\n- ![Praia do Camilo 5](https://images.placeholders.dev/?width=300&height=300&text=Praia+do+Camilo+5)\n\n**[Italy - Cala Goloritze](https://www.sardinianbeaches.com/en/cala-goloritze)** is a secluded beach located on the east coast of Sardinia, Italy. The beach is known for its crystal-clear waters, white pebble beach, and stunning limestone cliffs. Visitors can access the beach by hiking down a steep trail, which offers breathtaking views of the coastline.\n\n- ![Cala Goloritze 1](https://images.placeholders.dev/?width=300&height=300&text=Cala+Goloritze+1)\n- ![Cala Goloritze 2](https://images.placeholders.dev/?width=300&height=300&text=Cala+Goloritze+2)\n- ![Cala Goloritze 3](https://images.placeholders.dev/?width=300&height=300&text=Cala+Goloritze+3)\n- ![Cala Goloritze 4](https://images.placeholders.dev/?width=300&height=300&text=Cala+Goloritze+4)\n- ![Cala Goloritze 5](https://images.placeholders.dev/?width=300&height=300&text=Cala+Goloritze+5)\n\n"
}

const mockConversation: Conversation = {
    "id": 4,
    "name": "Conversation 4",
    "messages": [
        {
            "role": "user",
            "content": "Give me 3 beaches in Europe with brief description"
        },
        {
            "role": "assistant",
            "content": "Sure, here are three beaches in Europe with a brief description :\n\n**Navagio Beach, Greece**, also known as Shipwreck Beach, is located on the Greek island of Zakynthos. The beach is famous for its crystal-clear turquoise waters and the rusted remains of a shipwreck that washed ashore in 1980. The beach is only accessible by boat, but visitors can take in the stunning views from a nearby cliff. \n\n**Cala Macarella, Spain** is a beautiful beach located on the Spanish island of Menorca. The beach is known for its crystal-clear waters and fine white sand. The beach is surrounded by cliffs and pine trees, making it a picturesque spot for swimming and sunbathing. \n\n**Praia da Rocha, Portugal** is a popular beach located in the Algarve region of Portugal. The beach is known for its stunning cliffs, golden sand, and clear waters. The beach is surrounded by restaurants, bars, and shops, making it a great spot for a day trip or a longer stay."
        },
        mockedEGMessage,
        {
            "role": "user",
            "content": "Give me 3 beaches in Europe with brief description"
        },
        {
            "role": "assistant",
            "content": "Sure, here are three beaches in Europe with a brief description :\n\n**Navagio Beach, Greece**, also known as Shipwreck Beach, is located on the Greek island of Zakynthos. The beach is famous for its crystal-clear turquoise waters and the rusted remains of a shipwreck that washed ashore in 1980. The beach is only accessible by boat, but visitors can take in the stunning views from a nearby cliff. \n\n**Cala Macarella, Spain** is a beautiful beach located on the Spanish island of Menorca. The beach is known for its crystal-clear waters and fine white sand. The beach is surrounded by cliffs and pine trees, making it a picturesque spot for swimming and sunbathing. \n\n**Praia da Rocha, Portugal** is a popular beach located in the Algarve region of Portugal. The beach is known for its stunning cliffs, golden sand, and clear waters. The beach is surrounded by restaurants, bars, and shops, making it a great spot for a day trip or a longer stay."
        },
        mockedEGMessage,
        {
            "role": "user",
            "content": "Give me 3 beaches in Europe with brief description"
        },
        {
            "role": "assistant",
            "content": "Sure, here are three beaches in Europe with a brief description :\n\n**Navagio Beach, Greece**, also known as Shipwreck Beach, is located on the Greek island of Zakynthos. The beach is famous for its crystal-clear turquoise waters and the rusted remains of a shipwreck that washed ashore in 1980. The beach is only accessible by boat, but visitors can take in the stunning views from a nearby cliff. \n\n**Cala Macarella, Spain** is a beautiful beach located on the Spanish island of Menorca. The beach is known for its crystal-clear waters and fine white sand. The beach is surrounded by cliffs and pine trees, making it a picturesque spot for swimming and sunbathing. \n\n**Praia da Rocha, Portugal** is a popular beach located in the Algarve region of Portugal. The beach is known for its stunning cliffs, golden sand, and clear waters. The beach is surrounded by restaurants, bars, and shops, making it a great spot for a day trip or a longer stay."
        },
        mockedEGMessage,
    ],
    "model": {
        "id": "gpt-3.5-turbo",
        "name": "Default (GPT-3.5)"
    },
    "prompt": "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown."
}

export default mockConversation