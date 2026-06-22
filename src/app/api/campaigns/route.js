import { collectionHandlers } from "@/lib/resource-route";
import CampaignService from "@/services/CampaignService";
export const { GET, POST } = collectionHandlers(CampaignService);
