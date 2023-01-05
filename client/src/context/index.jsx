import React, { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	useAddress,
	useContract,
	useMetamask,
	useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
	const { contract } = useContract(
		import.meta.env.VITE_CAMPAIGN_CONTRACT_KEY
	);
	const { mutateAsync: createCampaign } = useContractWrite(
		contract,
		"createCampaign"
	);
	const [isLoading, setIsLoading] = useState(false);
	const address = useAddress();
	const connect = useMetamask();
	const navigate = useNavigate();

	const publishCampaign = async (form) => {
		try {
			const data = await createCampaign([
				address, // owner
				form.title, // title
				form.description, // description
				form.target, // target fund
				new Date(form.deadline).getTime(), // deadline as JS time,
				form.image, // campaign image
			]);

			toast.success("Campaign created successfully");
		} catch (error) {
			toast.error(
				"Gets Error while creating the campaign, pls try again."
			);
			console.log("contract call failure:- ", error);
		}
	};

	const getCampaigns = async () => {
		const campaigns = await contract.call("getCampaigns");

		const parsedCampaigns = campaigns.map((campaign, i) => ({
			owner: campaign.owner,
			title: campaign.title,
			description: campaign.description,
			target: ethers.utils.formatEther(campaign.target.toString()),
			deadline: campaign.deadline.toNumber(),
			amountCollected: ethers.utils.formatEther(
				campaign.amountCollected.toString()
			),
			image: campaign.image,
			pId: i,
		}));
		// console.log(parsedCampaigns);

		return parsedCampaigns;
	};

	const getUserCampaigns = async () => {
		const allCampaigns = await getCampaigns();

		const filteredCampaigns = allCampaigns.filter(
			(campaign) => campaign.owner === address
		);

		return filteredCampaigns;
	};

	const donate = async (pId, amount, address, owner) => {
		if (address == owner) {
			toast.warning("You can't donate to your own campaign");
			await new Promise((resolve) => setTimeout(resolve, 6000));
			navigate("/");
		} else {
			if (amount < 0) {
				toast.warning("Please correct the amount");
				await new Promise((resolve) => setTimeout(resolve, 6000));
				window.location.reload(false);
			}
			setIsLoading(true);
			const data = await contract.call("donateToCampaign", pId, {
				value: ethers.utils.parseEther(amount),
			});

			return data;
		}
	};

	const getDonations = async (pId) => {
		const donations = await contract.call("getDonators", pId);
		const numberOfDonations = donations[0].length;

		const parsedDonations = [];

		for (let i = 0; i < numberOfDonations; i++) {
			parsedDonations.push({
				donator: donations[0][i],
				donation: ethers.utils.formatEther(donations[1][i].toString()),
			});
		}

		return parsedDonations;
	};

	return (
		<StateContext.Provider
			value={{
				address,
				contract,
				connect,
				createCampaign: publishCampaign,
				getCampaigns,
				getUserCampaigns,
				donate,
				getDonations,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
