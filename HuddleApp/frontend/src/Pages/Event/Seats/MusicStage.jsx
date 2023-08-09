import './SeatsLayout.css'

export default function MusicStage() {
	return (
		<>
			<div className="music-stage">
				<div className="stage-floor"></div>
				<div className="stage-platform">
					<div className="stage-instruments"></div>
				</div>
				<div className="stage-lights">
					<div className="stage-light"></div>
					<div className="stage-light"></div>
					<div className="stage-light"></div>
				</div>
			</div>

		</>
	);
}