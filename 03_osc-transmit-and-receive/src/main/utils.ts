import os from "os";

/**
 * 自分のIPアドレスを取得
 * @returns
 */
export const getLocalAddress = (): { name: string; address: string }[] => {
	const interfaces = os.networkInterfaces();
	const results: { name: string; address: string }[] = [];

	for (const dev in os.networkInterfaces()) {
		interfaces[dev]!.forEach((details) => {
			if (!details.internal) {
				switch (details.family) {
					case "IPv4":
						results.push({ name: dev, address: details.address });
						break;
					case "IPv6":
						results.push({ name: dev, address: details.address });
						break;
				}
			}
		});
	}
	return results;
};
