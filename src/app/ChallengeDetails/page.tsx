// ChallengeDetails.tsx
import React from "react";

interface ChallengeDetailsProps {
  challengeName: string;
  completionPercentages: { [date: string]: number };
}

const ChallengeDetails: React.FC<ChallengeDetailsProps> = ({
  challengeName,
  completionPercentages,
}) => {
  return (
    <div>
      <h2>{challengeName} Details</h2>
      <ul>
        {Object.entries(completionPercentages).map(([date, percentage]) => (
          <li key={date}>
            {date}: {percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeDetails;
