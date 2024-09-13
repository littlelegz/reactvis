import React from 'react';

import Glyph from '../glyphs/glyph';

/**
 * 
 */
const GlyphStack = ({ height, width, indices, alphabet, lv, transform, alpha, inverted, onSymbolMouseOver, onSymbolMouseOut, onSymbolClick, curr }) => {
	// TODO: Implement coloring to border important residues. Will be done by editing "glyphrect"
	// TODO: Implement opacity to highlight important residues. Will be done by editing "fillOpacity={alpha}"
	// Index stored in curr, can use this to determine opacity, color, importance
	//console.log("Rendering: ", curr);
	/* move up from bottom */
	let cy = height; // start from bottom with smallest letter
	let xscale = width / 100.0; // scale to glyphs' 100x100 viewport

	/* if no alpha passed, default to opaque */
	alpha = alpha || 1;

	/* stack glyphs in order */
	let glyphs = indices.map(index => {

		if (!alphabet[index] || !alphabet[index].component) { return null; }
		if (lv[index] === 0.0) { return null; }

		cy -= lv[index] * 100.0;
		const ccy = inverted ? cy + lv[index] * 100.0 : cy;

		if (!alphabet[index].component.map) {
			let G = alphabet[index].component;
			return (
				<g transform={"translate(0," + ccy + ")"} key={index}
					onMouseOver={onSymbolMouseOver && (() => onSymbolMouseOver(alphabet[index]))}
					onMouseOut={onSymbolMouseOut && (() => onSymbolMouseOut(alphabet[index]))}
					onClick={onSymbolClick && (() => onSymbolClick(alphabet[index]))}>
					<Glyph xscale={xscale} yscale={lv[index]} inverted={inverted}>
						<G fill={alphabet[index].color} fillOpacity={alpha} {...alphabet[index]} />
					</Glyph>
				</g>
			);
		}

		let _xscale = xscale * 0.8 / alphabet[index].component.length;
		if (!alphabet[index].color.map)
			alphabet[index].color = alphabet[index].component.map(x => alphabet[index].color);
		return alphabet[index].component.map((G, i) => (
			<g transform={"translate(" + (i * width * 0.8 / alphabet[index].component.length + width * 0.1) + "," + ccy + ")"} key={index + "_" + i}
				onMouseOver={onSymbolMouseOver && (() => onSymbolMouseOver(alphabet[index]))}
				onMouseOut={onSymbolMouseOut && (() => onSymbolMouseOut(alphabet[index]))}
				onClick={onSymbolClick && (() => onSymbolClick(alphabet[index]))}
			>
				<Glyph xscale={_xscale} yscale={lv[index]} inverted={inverted}>
					<G fill={alphabet[index].color[i]} fillOpacity={alpha} {...alphabet[index]} />
				</Glyph>
			</g>
		));

	});

	/* wrap glyphs in g */
	return (
		<g transform={transform}>
			{glyphs}
			<rect className="glyphrect" style={{ width: "73px", height: "445px", fill: "red", strokeWidth: "2px", stroke: "lightgrey" }}
				onClick={onSymbolClick && (() => onSymbolClick(alphabet))}
				//</g>onMouseOver={onSymbolMouseOver && (() => onSymbolMouseOver(alphabet))}
				>
			</rect>
		</g>
	);

};
export default GlyphStack;