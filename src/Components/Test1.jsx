import React, { useState, useEffect } from "react";

const IncrementalTextSplitter = () => {
  // State to store the complete text as it arrives
  const [fullText, setFullText] = useState("");

  // State to store the split chunks
  const [splitTexts, setSplitTexts] = useState([]);

  // Track the position of the last processed character
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);

  // Track the space count between splits
  const [currentSpaceCount, setCurrentSpaceCount] = useState(0);

  // Track the start index of the current split
  const [currentSplitStartIndex, setCurrentSplitStartIndex] = useState(0);

  // This would be your actual token stream connection
  // This is just a mock example to simulate incoming tokens
  useEffect(() => {
    // Mock incoming text stream (replace this with your actual stream)
    const mockTextStream =
      "This is a sample text with many spaces that will be split every five spaces. Here we continue with more text to demonstrate how the splitting works across multiple streaming updates.";

    // Simulate streaming by sending multiple characters at a time to mimic token chunks
    let index = 0;
    const interval = setInterval(() => {
      if (index < mockTextStream.length) {
        // Send 2-5 characters at a time to simulate tokens
        const chunkSize = Math.floor(Math.random() * 4) + 2;
        const endIndex = Math.min(index + chunkSize, mockTextStream.length);
        const nextChunk = mockTextStream.substring(index, endIndex);

        // Add new token chunk to the full text
        setFullText((prev) => prev + nextChunk);

        index = endIndex;
      } else {
        clearInterval(interval);
      }
    }, 200); // Adjust speed as needed

    return () => clearInterval(interval);
  }, []);

  // Process only new tokens whenever fullText changes
  useEffect(() => {
    if (fullText.length > lastProcessedIndex) {
      processNewTokens(fullText);
    }
  }, [fullText]);

  // Function to process only the newly arrived tokens
  const processNewTokens = (text) => {
    let spaceCount = currentSpaceCount;
    let splitStartIndex = currentSplitStartIndex;

    // Process only from the last processed index to the end of current text
    for (let i = lastProcessedIndex; i < text.length; i++) {
      // Count spaces
      if (text[i] === " ") {
        spaceCount++;

        // When 5 spaces are found, create a split
        if (spaceCount === 5) {
          // Extract the text from split start position to current position (including the space)
          const splitText = text.substring(splitStartIndex, i + 1);

          setSplitTexts((prev) => [...prev, splitText]);

          // Reset space count and update split start position
          spaceCount = 0;
          splitStartIndex = i + 1;
        }
      }
    }

    // Save the current state for next processing cycle
    setLastProcessedIndex(text.length);
    setCurrentSpaceCount(spaceCount);
    setCurrentSplitStartIndex(splitStartIndex);

    // If we've reached the end of the stream, add any remaining text as final split
    if (text.endsWith(".") && splitStartIndex < text.length) {
      const finalSplit = text.substring(splitStartIndex);
      setSplitTexts((prev) => [...prev, finalSplit]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Incremental Text Stream Processor
      </h2>

      <div className="mb-4">
        <h3 className="font-semibold">Incoming Text:</h3>
        <div className="p-2 border rounded bg-gray-50">
          {fullText || "Waiting for text..."}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Processed {lastProcessedIndex} characters, Current space count:{" "}
          {currentSpaceCount}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Text Splits (every 5 spaces):</h3>
        <div className="space-y-2">
          {splitTexts.map((split, index) => (
            <div key={index} className="p-2 border rounded bg-blue-50">
              <span className="font-mono text-sm">{`[${index}]: `}</span>
              <span>{split}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncrementalTextSplitter;
