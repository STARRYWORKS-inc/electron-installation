import os from "os";

/**
 * 自分のIPアドレスを取得
 * @returns
 */
export const getLocalAddress = () => {
	const interfaces = os.networkInterfaces();
	const ifacesObj: any = {
		ipv4: [],
		ipv6: [],
	};

	for (let dev in interfaces) {
		interfaces[dev]!.forEach((details) => {
			if (!details.internal) {
				switch (details.family) {
					case "IPv4":
						ifacesObj.ipv4.push({ name: dev, address: details.address });
						break;
					case "IPv6":
						ifacesObj.ipv6.push({ name: dev, address: details.address });
						break;
				}
			}
		});
	}
	return ifacesObj.ipv4[0].address;
};
