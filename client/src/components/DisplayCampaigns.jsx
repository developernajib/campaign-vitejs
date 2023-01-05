import React from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import { Loader } from "../components";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
	const navigate = useNavigate();
	const handleNavigate = (campaign) => {
		title = campaign.title;
		title = title.split(" ").join("-");
		title = title.split(".").join("");
		title = title.toLowerCase();
		navigate(`/campaign-details/${title}`, { state: campaign });
	};
	// console.log(campaigns);

	return (
		<div>
			<h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
				{title} ({campaigns.length})
			</h1>

			<div className="flex flex-wrap mt-[20px] gap-[26px]">
				{isLoading && <Loader title="Loading Campaign" />}
				{!isLoading && campaigns.length === 0 && (
					<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
						There is no campaigns yet. All campaigns are finished.
					</p>
				)}

				{!isLoading &&
					campaigns.length > 0 &&
					campaigns.map((campaign) => (
						<FundCard
							{...campaign}
							key={campaign.id}
							handleClick={() => handleNavigate(campaign)}
						/>
					))}
			</div>
		</div>
	);
};

export default DisplayCampaigns;
