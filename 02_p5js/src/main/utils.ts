import os from "os";

type IPAddresses = {
	ipv4: { name: string; address: string }[];
	ipv6: { name: string; address: string }[];
};

/**
 * 自分のIPアドレスを取得
 * @returns
 */
export const getLocalAddress = (): IPAddresses => {
	const interfaces = os.networkInterfaces();
	const results: IPAddresses = { ipv4: [], ipv6: [] };

	for (const dev in os.networkInterfaces()) {
		interfaces[dev]!.forEach((details) => {
			if (!details.internal) {
				switch (details.family) {
					case "IPv4":
						results.ipv4.push({ name: dev, address: details.address });
						break;
					case "IPv6":
						results.ipv6.push({ name: dev, address: details.address });
						break;
				}
			}
		});
	}
	return results;
};
