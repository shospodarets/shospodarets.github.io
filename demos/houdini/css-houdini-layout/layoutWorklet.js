registerLayout('foo', class {
    *intrinsicSizes() {}
    *layout() {
        return { autoBlockSize: Math.random() * 100; } // FUN!
    }
});

registerLayout('block-like', class {
    *intrinsicSizes(styleMap, children) {
        const childrenSizes = yield children.map((child) => {
            return child.intrinsicSizes();
        });

        const maxContentSize = childrenSizes.reduce((max, childSizes) => {
            return Math.max(max, childSizes.maxContentContribution);
        }, 0);

        const minContentSize = childrenSizes.reduce((max, childSizes) => {
            return Math.max(max, childSizes.minContentContribution);
        }, 0);

        return {maxContentSize, minContentSize};
    }

    *layout(space, children, styleMap, edges) {
        const inlineSize = resolveInlineSize(space, styleMap);

        const availableInlineSize = inlineSize - edges.all.inline;
        const availableBlockSize =
            resolveBlockSize(constraintSpace, styleMap) - edges.all.block;

        const childFragments = [];
        const childConstraintSpace = new ConstraintSpace({
            inlineSize: availableInlineSize,
            blockSize: availableBlockSize,
        });

        const childFragments = yield children.map((child) => {
            return child.layoutNextFragment(childConstraintSpace);
        });

        let blockOffset = edges.all.blockStart;
        for (let fragment of childFragments) {
            // Position the fragment in a block like manner, centering it in the
            // inline direction.
            fragment.blockOffset = blockOffset;
            fragment.inlineOffset = Math.max(
                edges.all.inlineStart,
                (availableInlineSize - fragment.inlineSize) / 2);

            blockOffset += fragment.blockSize;
        }

        const autoBlockSize = blockOffset + edges.all.blockEnd;
        const blockSize = resolveBlockSize(
            constraintSpace, styleMap, autoBlockSize);

        return {
            inlineSize: inlineSize,
            blockSize: blockSize,
            childFragments: childFragments,
        };
    }
});