
import React, { useState } from "react";

type Chemical = {
	id: number;
	name: string;
	symbol: string;
	regulation: string;
	threshold: string;
	description: string;
	exceeded: boolean;
};

type ToxicityDisplayProps = {
	data: Chemical[];
};




export const ToxicityDisplay: React.FC<ToxicityDisplayProps> = ({ data }) => {
	const [open, setOpen] = useState(false);
	const allSafe = data.every((chem) => !chem.exceeded);

		return (
			<div style={{ marginTop: "2rem", color: "#000", width: 500, marginLeft: "auto", marginRight: "auto" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					background: allSafe ? "#eaffea" : "#ffeaea",
					borderRadius: 12,
					boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
					padding: "1.2rem 2rem",
					cursor: "pointer",
					fontWeight: 600,
					fontSize: 20,
				}}
				onClick={() => setOpen((o) => !o)}
			>
				<span>Toxicity Data</span>
				{allSafe ? (
					<span style={{ color: "#388e3c", fontWeight: "bold", fontSize: 32 }} title="All Safe">
						&#10003;
					</span>
				) : (
					<span style={{ color: "#d32f2f", fontWeight: "bold", fontSize: 32 }} title="Some Exceeded">
						&#10060;
					</span>
				)}
			</div>
			{open && (
				<div style={{ marginTop: "1.5rem" }}>
					{data.map((chem) => (
						<div
							key={chem.id}
							style={{
								boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
								borderRadius: 12,
								padding: 24,
								background: chem.exceeded ? "#ffeaea" : "#eaffea",
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								minHeight: 180,
								position: "relative",
								color: "#000",
								marginBottom: 18,
							}}
						>
							<div style={{ marginBottom: 10 }}>
								<h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#000" }}>
									{chem.name} <span style={{ fontWeight: 400, color: "#000" }}>({chem.symbol})</span>
								</h3>
								<p style={{ margin: "8px 0", fontSize: 15, color: "#000" }}>{chem.description}</p>
							</div>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								<div>
									<span style={{ fontSize: 13, color: "#000" }}>
										<strong style={{ color: "#000" }}>Regulation:</strong> {chem.regulation}
									</span>
									<br />
									<span style={{ fontSize: 13, color: "#000" }}>
										<strong style={{ color: "#000" }}>Threshold:</strong> {chem.threshold}
									</span>
								</div>
								<div style={{ marginLeft: 16 }}>
									{chem.exceeded ? (
										<span style={{ color: "#d32f2f", fontWeight: "bold", fontSize: 32 }} title="Exceeded">
											&#10060;
										</span>
									) : (
										<span style={{ color: "#388e3c", fontWeight: "bold", fontSize: 32 }} title="Safe">
											&#10003;
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Wrapper component to inject data
type ToxicityWrapperProps = {
	jsonData: Chemical[];
};


const ToxicityWrapper: React.FC<ToxicityWrapperProps> = ({ jsonData }) => {
	return <ToxicityDisplay data={jsonData} />;
};

export default ToxicityWrapper;
