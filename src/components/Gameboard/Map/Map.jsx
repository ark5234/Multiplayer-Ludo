import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { PlayerDataContext, SocketContext } from '../../../App';

import mapImage from '../../../images/map.jpg';
import positionMapCoords from '../positions';
import pawnImages from '../../../constants/pawnImages';
import canPawnMove from './canPawnMove';
import getPositionAfterMove from './getPositionAfterMove';

const Map = ({ pawns, nowMoving, rolledNumber }) => {
    const player = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);

    const [hintPawn, setHintPawn] = useState();
    const [animatingPawn, setAnimatingPawn] = useState(null);
    const [previousPawns, setPreviousPawns] = useState([]);

    // Detect pawn movement for animation
    useEffect(() => {
        if (previousPawns.length > 0) {
            pawns.forEach(currentPawn => {
                const prevPawn = previousPawns.find(p => p._id === currentPawn._id);
                if (prevPawn && prevPawn.position !== currentPawn.position) {
                    // Pawn moved - trigger animation
                    setAnimatingPawn({
                        ...currentPawn,
                        fromPosition: prevPawn.position,
                        toPosition: currentPawn.position
                    });
                    
                    // Clear animation after 1 second
                    setTimeout(() => setAnimatingPawn(null), 1000);
                }
            });
        }
        setPreviousPawns([...pawns]);
    }, [pawns]);

    const paintPawn = useCallback((context, pawn, isAnimating = false) => {
        const { x, y } = positionMapCoords[pawn.position];
        const touchableArea = new Path2D();
        touchableArea.arc(x, y, 12, 0, 2 * Math.PI);
        const image = new Image();
        image.src = pawnImages[pawn.color];
        
        image.onload = function () {
            // Add animation effects
            if (isAnimating) {
                context.save();
                context.shadowColor = pawn.color;
                context.shadowBlur = 15;
                context.globalAlpha = 0.9;
            }
            
            // Add glow effect for moving pawns
            if (pawn.nowMoving && pawn.color === player.color) {
                context.save();
                context.shadowColor = '#ffff00';
                context.shadowBlur = 10;
                context.drawImage(image, x - 17, y - 15, 35, 30);
                context.restore();
            } else {
                context.drawImage(image, x - 17, y - 15, 35, 30);
            }
            
            if (isAnimating) {
                context.restore();
            }
        };
        return touchableArea;
    }, [player.color]);

    const handleCanvasClick = event => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect(),
            cursorX = event.clientX - rect.left,
            cursorY = event.clientY - rect.top;
        for (const pawn of pawns) {
            if (ctx.isPointInPath(pawn.touchableArea, cursorX, cursorY)) {
                if (canPawnMove(pawn, rolledNumber)) socket.emit('game:move', pawn._id);
            }
        }
        setHintPawn(null);
    };

    const handleMouseMove = event => {
        if (!nowMoving || !rolledNumber) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top;
        canvas.style.cursor = 'default';
        for (const pawn of pawns) {
            if (
                ctx.isPointInPath(pawn.touchableArea, x, y) &&
                player.color === pawn.color &&
                canPawnMove(pawn, rolledNumber)
            ) {
                const pawnPosition = getPositionAfterMove(pawn, rolledNumber);
                if (pawnPosition) {
                    canvas.style.cursor = 'pointer';
                    if (hintPawn && hintPawn.id === pawn._id) return;
                    setHintPawn({ id: pawn._id, position: pawnPosition, color: 'grey' });
                    return;
                }
            }
        }
        setHintPawn(null);
    };

    useEffect(() => {
        const rerenderCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = mapImage;
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
                pawns.forEach((pawn, index) => {
                    const isMovingPawn = animatingPawn && animatingPawn._id === pawn._id;
                    pawns[index].touchableArea = paintPawn(ctx, pawn, isMovingPawn);
                });
                if (hintPawn) {
                    paintPawn(ctx, hintPawn);
                }
            };
        };
        rerenderCanvas();
    }, [hintPawn, pawns, animatingPawn, paintPawn]);

    return (
        <canvas
            className='canvas-container'
            width={460}
            height={460}
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
        />
    );
};
export default Map;
