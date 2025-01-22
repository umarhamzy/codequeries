import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { questionTitle, questionDescription } = await request.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant and an expert programmer with unlimited years of experience who is capable of writing code, providing information and debugging code. Your responses are concise, easy to understand, and helpful. At the very end of your responses write 'DISCLAIMER: This is an AI generated response. Please check for mistakes.' after two line-breaks.",
          },
          {
            role: "user",
            content: `${questionTitle} \nHere's more information regarding the question, match your response closely with it: ${questionDescription}`,
          },
        ],
      }),
    });

    const responseData = await response.json();
    // console.log(responseData);
    const reply = responseData.choices[0].message.content;

    // console.log(responseData.choices[0]);

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
